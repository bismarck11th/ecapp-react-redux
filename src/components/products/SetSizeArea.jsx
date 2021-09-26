import React, { useCallback, useEffect, useState } from 'react';
// MUI
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
// Components
import { TextInput } from '../UIkit';

const useStyles = makeStyles({
  checkIcon: {
    float: 'right'
  },
  iconCells: {
    height: 48,
    width: 48
  }
});

const SetSizeArea = (props) => {
  const classes = useStyles();

  const [index, setIndex] = useState(0);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(0);

  const InputSize = useCallback(
    (e) => {
      setSize(e.target.value);
    },
    [setSize]
  );

  const InputQuantity = useCallback(
    (e) => {
      setQuantity(e.target.value);
    },
    [setQuantity]
  );

  const addSize = (index, size, quantity) => {
    if (size === '' || quantity === '') {
      // required input is blank
      return false;
    } else {
      // 新規サイズ追加(配列に要素を追加する形)
      if (index === props.sizes.length) {
        props.setSizes((prevState) => [
          ...prevState,
          { size: size, quantity: quantity }
        ]);
        setIndex(index + 1);
        setSize('');
        setQuantity(0);
      } else {
        // 既存サイズ変更(配列をまるっと更新)
        const newSizes = props.sizes;
        newSizes[index] = { size: size, quantity: quantity };
        props.setSizes(newSizes);
        setIndex(newSizes.length);
        setSize('');
        setQuantity(0);
      }
    }
  };

  // 編集時はeditSize -> addSize
  const editSize = (index, size, quantity) => {
    setIndex(index);
    setSize(size);
    setQuantity(quantity);
  };

  const deleteSize = (deleteIndex) => {
    // 削除するindex以外の配列を返す
    const newSizes = props.sizes.filter((item, i) => i !== deleteIndex);
    props.setSizes(newSizes);
  };

  // 編集時、indexの初期値が0のため更新
  useEffect(() => {
    setIndex(props.sizes.length);
  }, [props.sizes.length]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>サイズ</TableCell>
              <TableCell>数量</TableCell>
              <TableCell className={classes.iconCells} />
              <TableCell className={classes.iconCells} />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.sizes.length > 0 &&
              props.sizes.map((item, i) => (
                <TableRow key={item.size}>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => editSize(i, item.size, item.quantity)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => deleteSize(i)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="module-spacer--small" />
        <div>
          <TextInput
            fullWidth={false}
            label={'サイズ'}
            multiple={false}
            required={true}
            onChange={InputSize}
            rows={1}
            value={size}
            type={'text'}
          />
          <TextInput
            fullWidth={false}
            label={'数量'}
            multiple={false}
            required={true}
            onChange={InputQuantity}
            rows={1}
            value={quantity}
            type={'number'}
          />
        </div>
        <IconButton
          className={classes.checkIcon}
          onClick={() => addSize(index, size, quantity)}
        >
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>
    </div>
  );
};

export default SetSizeArea;
